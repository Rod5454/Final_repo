import React from 'react';
import PageTitle from './PageTitle';
import '../App.css';

function AdminPageLayout({ title, children }) {
  return (
    <div className="admin-page-container">
      <PageTitle title={title} />
      {children}
    </div>
  );
}

export default AdminPageLayout;