import React from 'react';
import { Eye, Edit2, Trash2 } from 'lucide-react';
import '../../assets/dashboard.css';

const TableActions = ({ 
  onView, 
  onEdit, 
  onDelete, 
  viewTitle = "View Details",
  editTitle = "Edit",
  deleteTitle = "Delete",
  customAction
}) => {
  return (
    <div className="action-buttons">
      {customAction}
      {onView && (
        <button 
          className="action-icon-btn view-btn"
          onClick={onView}
          title={viewTitle}
        >
          <Eye size={16} />
        </button>
      )}
      {onEdit && (
        <button 
          className="action-icon-btn edit-btn"
          onClick={onEdit}
          title={editTitle}
        >
          <Edit2 size={16} />
        </button>
      )}
      {onDelete && (
        <button 
          className="action-icon-btn delete-btn"
          onClick={onDelete}
          title={deleteTitle}
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
  );
};

export default TableActions;
