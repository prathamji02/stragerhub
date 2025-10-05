import React, { useState, useEffect } from 'react';

// NOTE: This component now takes the 'api' object as a prop
function AdminDashboard({ setView, api }) {
    const [adminView, setAdminView] = useState('reports');
    const [reports, setReports] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState(null);
    const [userChats, setUserChats] = useState([]);
    const [file, setFile] = useState(null);
    const [uploadMessage, setUploadMessage] = useState('');
    const [newUser, setNewUser] = useState({ enrollment_no: '', name: '', email: '', phone_no: '', gender: '' });
    const [registerMessage, setRegisterMessage] = useState('');

    const fetchData = async (type) => {
        setSelectedItem(null);
        setLoading(true);
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await api.get(`/admin/${type}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            if (type === 'reports') setReports(data);
            if (type === 'users') setUsers(data);
        } catch (error) {
            console.error(`Failed to fetch ${type}`, error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(adminView);
    }, [adminView]);

    const handleBanUser = async (userId, fakeName) => {
        if (window.confirm(`Are you sure you want to ban ${fakeName}? This action is permanent.`)) {
            try {
                const token = localStorage.getItem('authToken');
                await api.post('/admin/ban', { userId }, { headers: { Authorization: `Bearer ${token}` }});
                alert(`${fakeName} has been banned.`);
                setSelectedItem(null);
                fetchData(adminView); 
            } catch (error) {
                alert('Failed to ban user.');
            }
        }
    };
    
    const handleDeleteLog = async (reportId) => {
         if (window.confirm(`Are you sure you want to delete this log? This action cannot be undone.`)) {
             try {
                 const token = localStorage.getItem('authToken');
                 await api.delete(`/admin/reports/${reportId}`, { headers: { Authorization: `Bearer ${token}` }});
                 alert(`Log has been deleted.`);
                 fetchData('reports');
             } catch (error) {
                 alert('Failed to delete log.');
             }
         }
     };

     const handleFreezeUser = async (userId, fakeName) => {
         if (window.confirm(`Are you sure you want to toggle the freeze status for ${fakeName}?`)) {
             try {
                 const token = localStorage.getItem('authToken');
                 await api.post('/admin/freeze', { userId }, { headers: { Authorization: `Bearer ${token}` }});
                 alert(`Freeze status toggled for ${fakeName}.`);
                 fetchData('users'); 
             } catch (error) {
                 alert('Failed to toggle freeze status.');
             }
         }
     };
    
    const handleRegisterUser = async (e) => {
        e.preventDefault();
        setRegisterMessage('Registering...');
        try {
            const token = localStorage.getItem('authToken');
            const { data } = await api.post('/admin/register', newUser, { headers: { Authorization: `Bearer ${token}` }});
            setRegisterMessage(data.message);
            setNewUser({ enrollment_no: '', name: '', email: '', phone_no: '', gender: '' });
            fetchData('users');
        } catch (error) {
            setRegisterMessage(error.response?.data?.error || 'Registration failed.');
        }
    };

    const handleViewUserChats = async (user) => {
         setSelectedItem(user);
         setUserChats([]);
         try {
             const token = localStorage.getItem('authToken');
             const { data } = await api.get(`/admin/chats/${user.id}`, { headers: { Authorization: `Bearer ${token}` }});
             setUserChats(data);
         } catch (error) {
             console.error("Failed to fetch user chats", error);
         }
     };

     const handleFileUpload = async (e) => {
         e.preventDefault();
         if (!file) {
             setUploadMessage('Please select a file first.');
             return;
         }
         const formData = new FormData();
         formData.append('userFile', file);
         try {
             const token = localStorage.getItem('authToken');
             setUploadMessage('Uploading...');
             const { data } = await api.post('/admin/users/upload', formData, {
                 headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${token}` }
             });
             setUploadMessage(data.message);
             fetchData('users');
         } catch (error) {
             setUploadMessage(error.response?.data?.error || 'File upload failed.');
         }
     };
    
    if (selectedItem) {
        return (
            <div className="bg-gray-900 text-white min-h-screen p-4 pt-8">
              {/* This detail view JSX is unchanged */}
            </div>
        )
    }

    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 pt-8">
            <div className="w-full max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                    <div>
                        <button onClick={() => fetchData(adminView)} className="mr-4 px-4 py-2 rounded bg-gray-600 hover:bg-gray-700">Refresh Data</button>
                        <button onClick={() => setView('home')} className="text-blue-400 hover:underline">Back to Home &rarr;</button>
                    </div>
                </div>
                
                <div className="flex border-b border-gray-700 mb-4">
                    <button onClick={() => setAdminView('reports')} className={`py-2 px-4 ${adminView === 'reports' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Reports & Logs</button>
                    <button onClick={() => setAdminView('users')} className={`py-2 px-4 ${adminView === 'users' ? 'border-b-2 border-blue-500 text-white' : 'text-gray-400'}`}>Users</button>
                </div>

                {loading && <p>Loading...</p>}

                {adminView === 'reports' && !loading && (
                    <div className="bg-gray-800 rounded-lg shadow-lg">
                        {/* Reports list JSX is unchanged */}
                    </div>
                )}
                
                {adminView === 'users' && !loading && (
                    <div>
                        <div className="bg-gray-800 p-4 rounded-lg mb-6">
                            {/* Upload form JSX is unchanged */}
                        </div>
                       <div className="bg-gray-800 p-4 rounded-lg mb-6">
                            {/* Register form JSX is unchanged */}
                        </div>
                        <div className="bg-gray-800 rounded-lg shadow-lg overflow-x-auto">
                            {/* Users table JSX is unchanged */}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;