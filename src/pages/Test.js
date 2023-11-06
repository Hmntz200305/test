import React, { useEffect, useState } from 'react';
import { useAuth } from '../AuthContext';

function CSVUploader() {
  const [selectedFile, setSelectedFile] = useState(null);
  const { setNotificationStatus, setNotification, setNotificationInfo, refreshAssetData } = useAuth();

  useEffect(() => {
    refreshAssetData();
  }, []);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    if (!selectedFile) {
      setNotification('Pilih CSV');
      setNotificationStatus(true);
      setNotificationInfo('Error');
      return;
    }

    const formData = new FormData();
    formData.append('csvFile', selectedFile);

    fetch('http://sipanda.online:5000/api/importcsv', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.message)
        refreshAssetData();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <input id="dropzone-file" type="file" accept=".csv, .xls" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload CSV</button>
    </div>
  );
}

export default CSVUploader;
