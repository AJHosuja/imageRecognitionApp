import { ComputerVisionClient } from '@azure/cognitiveservices-computervision';
import { ApiKeyCredentials } from '@azure/ms-rest-js';

// Authentication requirements
const key = process.env.REACT_APP_AZURE_COMPUTER_VISION_KEY;
const endpoint = process.env.REACT_APP_AZURE_COMPUTER_VISION_ENDPOINT;

// Cognitive service features
const visualFeatures = [
    "ImageType",
    "Faces",
    "Adult",
    "Categories",
    "Color",
    "Tags",
    "Description",
    "Objects",
    "Brands"
];

export const isConfigured = () => {
    const result = (key && endpoint && (key.length > 0) && (endpoint.length > 0)) ? true : false;
    console.log(`key = ${key}`)
    console.log(`endpoint = ${endpoint}`)
    console.log(`ComputerVision isConfigured = ${result}`)
    return result;
}
// Analyze Image from URL
export const computerVision = async (url) => {
    const computerVisionClient = new ComputerVisionClient(
        new ApiKeyCredentials({ inHeader: { 'Ocp-Apim-Subscription-Key': key } }), endpoint);
    const urlToAnalyze = url;
    const analysis = await computerVisionClient.analyzeImage(urlToAnalyze, { visualFeatures });
    return { "URL": urlToAnalyze, ...analysis };
}
