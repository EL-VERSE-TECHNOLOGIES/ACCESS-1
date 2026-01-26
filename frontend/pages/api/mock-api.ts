// pages/api/mock-api.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { mockApi } from '../../lib/mock-api'; // Adjust path as needed

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Extract the API path from the URL
    const { path } = req.query;
    const apiUrl = `/${Array.isArray(path) ? path.join('/') : path}`;
    
    // Route the request based on method
    switch (req.method) {
      case 'GET':
        const getData = await mockApi.get(apiUrl);
        res.status(200).json(getData);
        break;
        
      case 'POST':
        const postData = await mockApi.post(apiUrl, req.body);
        res.status(200).json(postData);
        break;
        
      case 'PUT':
        const putData = await mockApi.put(apiUrl, req.body);
        res.status(200).json(putData);
        break;
        
      case 'DELETE':
        const deleteData = await mockApi.delete(apiUrl);
        res.status(200).json(deleteData);
        break;
        
      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error('Mock API Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}