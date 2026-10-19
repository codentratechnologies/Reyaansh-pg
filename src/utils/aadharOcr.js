import Tesseract from 'tesseract.js';
import * as pdfjsLib from 'pdfjs-dist';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch (err) {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjsLib.version || '4.0.379'}/build/pdf.worker.min.mjs`;
  }
}

/**
 * Normalizes text for robust regex matching across potential OCR noise
 */
function cleanText(text = '') {
  return text
    .replace(/[\r\n]+/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
}

/**
 * Evaluates extracted text for Aadhaar card indicators.
 * Requires at least 50% match score with the front side being compulsory.
 */
export function evaluateAadhaarText(rawText = '') {
  const normalized = cleanText(rawText);
  const lower = normalized.toLowerCase();

  // 1. Government / Authority / Aadhaar Header (Front Side)
  const hasGovt = /government\s+of\s+india|govt\s+of\s+india|bharat\s+sarkar|भारत\s*सरकार/i.test(lower);
  const hasUidaiAuth = /unique\s+identification\s+authority|authority\s+of\s+india|भारतीय\s*विशिष्ट\s*पहचान\s*प्राधिकरण/i.test(lower);
  const hasAadhaarWord = /\baadhaar\b|\baadhar\b|\badhar\b|\bआधार\b/i.test(lower);
  const hasHeader = hasGovt || hasUidaiAuth || hasAadhaarWord;

  // 2. Date of Birth (Front Side)
  // Note: Avoid mistaking UIDAI helpline "1947" as a birth year!
  const hasDobKeyword = /\bdob\b|\bd\.o\.b\b|date\s+of\s+birth|year\s+of\s+birth|\byob\b|जन्म\s*तिथि/i.test(lower);
  const fullDateMatch = normalized.match(/\b([0-3]?\d[\/\-\.][0-1]?\d[\/\-\.](?:19\d{2}|20\d{2}))\b/);
  const labelledYearMatch = normalized.match(/(?:dob|d\.o\.b|birth|year|yob|जन्म)\s*[:\-\/]?\s*(?:year\s*)?(\b(?!1947\b)(?:19\d{2}|20\d{2})\b)/i);
  
  const hasDob = Boolean(fullDateMatch) || (hasDobKeyword && Boolean(labelledYearMatch)) || (hasDobKeyword && !lower.includes('1947'));
  const extractedDob = fullDateMatch ? fullDateMatch[1] : (labelledYearMatch ? labelledYearMatch[1] : null);

  // 3. Gender (Front Side)
  const genderMatch = normalized.match(/\b(male|female|transgender|पुरुष|महिला)\b/i);
  const hasGender = Boolean(genderMatch);
  let extractedGender = null;
  if (genderMatch) {
    const g = genderMatch[1].toLowerCase();
    if (g === 'male' || g === 'पुरुष') extractedGender = 'Male';
    else if (g === 'female' || g === 'महिला') extractedGender = 'Female';
    else extractedGender = 'Other';
  }

  // 4. Aadhaar Number (12 digits) or Masked Aadhaar (XXXX XXXX 1234)
  const aadhaarNumMatch = normalized.match(/\b(\d{4}\s+\d{4}\s+\d{4})\b/) ||
                          normalized.match(/\b([xX\*\d]{4}\s+[xX\*\d]{4}\s+\d{4})\b/) ||
                          normalized.match(/\b(\d{12})\b/);
  const hasAadhaarNumber = Boolean(aadhaarNumMatch);

  // Partial Aadhaar number or explicit "Aadhaar No" mention
  const hasPartialAadhaar = /\b\d{4}\s+\d{4}\b/.test(normalized) ||
                            /aadhaar\s*(?:no|number|card|क्रमांक)/i.test(lower);

  // 5. Virtual ID (VID) - 16 digits
  const vidMatch = normalized.match(/vid\s*[:\-]??\s*(\d{4}\s*\d{4}\s*\d{4}\s*\d{4})/i) ||
                   normalized.match(/\bvid\b/i);
  const hasVid = Boolean(vidMatch);

  // 6. Aadhaar Slogan / Motto
  const hasMotto = /मेरा\s*आधार|मेरी\s*पहचान|mera\s*aadhaar|meri\s*pehchan/i.test(lower);

  // 7. Back Side Indicators
  const hasAddressKeyword = /\baddress\b|\bपता\b|\bs\/o\b|\bd\/o\b|\bw\/o\b|\bc\/o\b|care\s+of|son\s+of|daughter\s+of|wife\s+of/i.test(lower);
  const pincodeMatch = normalized.match(/\b([1-9][0-9]{2}\s?[0-9]{3})\b/);
  const hasPincode = Boolean(pincodeMatch);
  const hasHelpInfo = /\b1947\b|uidai\.gov\.in|help@uidai|p\.o\.\s*box|bengaluru/i.test(lower);
  const hasBackIndicators = hasAddressKeyword || (hasPincode && hasHelpInfo);

  // --- SCORING CALCULATION ---
  // Front-side weights (up to 70 points maximum):
  let frontScore = 0;
  if (hasHeader) frontScore += 25;
  if (hasDob) frontScore += 20;
  if (hasGender) frontScore += 15;
  if (hasAadhaarNumber || hasVid) frontScore += 25;
  else if (hasPartialAadhaar) frontScore += 15;
  if (hasMotto) frontScore += 5;

  // Back-side weights (up to 30 points maximum):
  let backScore = 0;
  if (hasAddressKeyword) backScore += 15;
  if (hasPincode) backScore += 10;
  if (hasHelpInfo) backScore += 5;

  // Overall match percentage
  // Normalise: Front side (up to 70%) + Back side (up to 30%)
  const totalScore = Math.min(100, Math.round(
    Math.min(70, frontScore) + Math.min(30, backScore)
  ));

  // --- FRONT SIDE COMPULSORY REQUIREMENT ---
  // User specifies: "atleast 50% we have to match, means atleast the frontside of the aadharcard is cumpolsury"
  // Front side detection strictly requires:
  // 1) Genuine personal identity markers on front: DOB or Gender
  // 2) Authenticity / authority markers: Header (Govt/UIDAI/Aadhaar) or Aadhaar No or VID
  // 3) Front score contribution >= 35 points
  const hasFrontIdentity = hasDob || hasGender;
  const hasFrontAuthenticity = hasHeader || hasAadhaarNumber || hasVid || hasPartialAadhaar;
  const isFrontPresent = frontScore >= 35 && hasFrontIdentity && hasFrontAuthenticity;

  // Back side presence
  const isBackPresent = backScore >= 20 || (hasAddressKeyword && hasPincode);

  // Document meets requirements if front side is confirmed and total score is >= 50%
  const isValid = isFrontPresent && totalScore >= 50;

  // Feedback checks list for the user UI
  const checks = [
    {
      id: 'front',
      label: 'Aadhaar Front Side Detected',
      passed: isFrontPresent,
      required: true,
      description: 'Front side containing personal identity is mandatory'
    },
    {
      id: 'header',
      label: 'Govt. of India / UIDAI Header',
      passed: hasHeader,
      required: false,
      description: 'Official Government of India or UIDAI authority marks'
    },
    {
      id: 'aadhaarNum',
      label: 'Aadhaar / VID Number',
      passed: hasAadhaarNumber || hasVid,
      required: false,
      description: hasAadhaarNumber ? '12-digit Aadhaar number found' : (hasVid ? 'Virtual ID (VID) found' : 'Aadhaar or Virtual ID number')
    },
    {
      id: 'dob',
      label: 'Date of Birth (DOB)',
      passed: hasDob,
      required: false,
      description: extractedDob ? `Detected: ${extractedDob}` : 'Birth date or DOB marker'
    },
    {
      id: 'gender',
      label: 'Gender',
      passed: hasGender,
      required: false,
      description: extractedGender ? `Detected: ${extractedGender}` : 'Male / Female gender marker'
    },
    {
      id: 'back',
      label: 'Back Side / Address Info',
      passed: isBackPresent,
      required: false,
      description: isBackPresent ? 'Address and Pincode verified' : 'Optional if front side is verified'
    }
  ];

  let rejectionReason = null;
  if (!isValid) {
    if (!isFrontPresent) {
      rejectionReason = 'Front side of the Aadhaar card is compulsory. Please ensure the uploaded file clearly shows the front side with Name, Date of Birth, Gender, and Aadhaar/VID number.';
    } else if (totalScore < 50) {
      rejectionReason = `Aadhaar match score is only ${totalScore}% (minimum 50% required). Please upload a clearer or uncropped image/PDF.`;
    } else {
      rejectionReason = 'The uploaded document does not meet the Aadhaar verification criteria. Please provide a clear Aadhaar card.';
    }
  }

  return {
    isValid,
    totalScore,
    frontScore,
    backScore,
    isFrontPresent,
    isBackPresent,
    rejectionReason,
    checks,
    extractedData: {
      aadhaarNumber: aadhaarNumMatch ? aadhaarNumMatch[1] : null,
      vid: vidMatch ? (vidMatch[1] || 'VID Found') : null,
      dob: extractedDob,
      gender: extractedGender,
      pincode: pincodeMatch ? pincodeMatch[1].replace(/\s/g, '') : null
    },
    rawText
  };
}

/**
 * Extracts text from a PDF file using PDF.js.
 * If embedded text is found, uses it directly; otherwise renders the first page to canvas and runs OCR.
 */
async function extractTextFromPdf(file, onProgress) {
  if (onProgress) onProgress({ step: 'loading_pdf', percent: 10, message: 'Opening PDF document...' });

  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdf = await loadingTask.promise;

  let combinedText = '';
  const numPages = Math.min(pdf.numPages, 2); // Check up to first 2 pages

  // Pass 1: Try reading selectable vector text
  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const textContent = await page.getTextContent();
    const pageStrings = textContent.items.map(item => item.str).filter(Boolean);
    if (pageStrings.length > 0) {
      combinedText += ' ' + pageStrings.join(' ');
    }
  }

  // If sufficient text was found in the PDF (e.g. digital e-Aadhaar PDF)
  if (combinedText.trim().length > 60) {
    const initialEval = evaluateAadhaarText(combinedText);
    if (initialEval.isValid || initialEval.totalScore >= 45) {
      if (onProgress) onProgress({ step: 'done', percent: 100, message: 'PDF text extracted successfully' });
      return combinedText;
    }
  }

  // Pass 2: Scanned PDF fallback - render first page to canvas and run OCR
  if (onProgress) onProgress({ step: 'rendering_page', percent: 25, message: 'Rendering PDF page for OCR analysis...' });
  const page = await pdf.getPage(1);
  const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for high OCR accuracy

  const canvas = document.createElement('canvas');
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const context = canvas.getContext('2d');

  await page.render({ canvasContext: context, viewport }).promise;

  // Run Tesseract on rendered page canvas
  if (onProgress) onProgress({ step: 'ocr_running', percent: 40, message: 'Running OCR on PDF page...' });

  const worker = await Tesseract.createWorker('eng', 1, {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        const percent = Math.min(95, 40 + Math.round((m.progress || 0) * 55));
        onProgress({ step: 'ocr_progress', percent, message: `Analyzing document (${percent}%)...` });
      }
    }
  });

  try {
    const ocrResult = await worker.recognize(canvas);
    combinedText += ' ' + (ocrResult.data?.text || '');
  } finally {
    await worker.terminate();
  }

  return combinedText;
}

/**
 * Extracts text from an image file using Tesseract.js OCR.
 */
async function extractTextFromImage(file, onProgress) {
  if (onProgress) onProgress({ step: 'init_ocr', percent: 15, message: 'Initializing OCR engine...' });

  const worker = await Tesseract.createWorker('eng', 1, {
    logger: m => {
      if (m.status === 'recognizing text' && onProgress) {
        const percent = Math.min(95, 20 + Math.round((m.progress || 0) * 75));
        onProgress({ step: 'ocr_progress', percent, message: `Scanning document text (${percent}%)...` });
      }
    }
  });

  try {
    if (onProgress) onProgress({ step: 'scanning', percent: 25, message: 'Analyzing image features...' });
    const result = await worker.recognize(file);
    return result.data?.text || '';
  } finally {
    await worker.terminate();
  }
}

/**
 * Main verification entrypoint.
 * Accepts a File (Image or PDF) and verifies whether it satisfies Aadhaar criteria.
 *
 * @param {File} file - Uploaded File object
 * @param {Function} [onProgress] - Optional callback ({ step, percent, message })
 * @returns {Promise<Object>} Verification evaluation object
 */
export async function verifyAadhaarDocument(file, onProgress) {
  if (!file) {
    throw new Error('No file provided for verification.');
  }

  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  const isImage = file.type.startsWith('image/') || /\.(jpg|jpeg|png|webp)$/i.test(file.name);

  if (!isPdf && !isImage) {
    return {
      isValid: false,
      totalScore: 0,
      isFrontPresent: false,
      rejectionReason: 'Unsupported file format. Please upload a PDF or an Image (JPG, PNG).',
      checks: []
    };
  }

  try {
    let extractedText = '';

    if (isPdf) {
      extractedText = await extractTextFromPdf(file, onProgress);
    } else {
      extractedText = await extractTextFromImage(file, onProgress);
    }

    if (onProgress) {
      onProgress({ step: 'evaluating', percent: 96, message: 'Verifying Aadhaar criteria & front-side...' });
    }

    const evaluation = evaluateAadhaarText(extractedText);

    if (onProgress) {
      onProgress({
        step: 'completed',
        percent: 100,
        message: evaluation.isValid ? 'Aadhaar verified successfully!' : 'Aadhaar verification failed'
      });
    }

    return evaluation;
  } catch (err) {
    console.error('Error during Aadhaar OCR verification:', err);
    return {
      isValid: false,
      totalScore: 0,
      isFrontPresent: false,
      rejectionReason: `OCR verification error: ${err.message || 'Failed to process document'}`,
      checks: []
    };
  }
}
