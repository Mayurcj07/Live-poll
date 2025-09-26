export const testBackendConnection = async () => {
  try {
    const response = await fetch('http://localhost:5000/socket.io/?EIO=4&transport=polling');
    console.log('Backend connection test:', response.status);
    return response.status === 200;
  } catch (error) {
    console.error('Backend connection failed:', error);
    return false;
  }
}