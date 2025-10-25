import React from "react";

const ListItem = ({ icon: Icon, title, subtitle, action, onClick }) => {
  return (
    <div className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
      <div className="flex items-start space-x-4">
        {Icon && <Icon className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />}
        <div>
          <h4 className="font-semibold text-gray-800">{title}</h4>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
        </div>
      </div>
      {action && <div onClick={onClick}>{action}</div>}
    </div>
  );
};

export default ListItem;
