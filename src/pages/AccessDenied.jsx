import React from "react";

const AccessDenied = () => (
  <section
    className="d-flex min-vh-100 align-items-center justify-content-center px-3"
    aria-labelledby="access-denied-title"
  >
    <div className="bg-white border rounded shadow-sm p-5 text-center">
      <h1 id="access-denied-title" className="h3 mb-3">
        غير مصرح لك بالوصول
      </h1>
      <p className="mb-0 text-gray-700">
        تتطلب هذه الصفحة صلاحيات مسؤول النظام. يمكنك تسجيل الخروج من الشريط
        العلوي.
      </p>
    </div>
  </section>
);

export default AccessDenied;
