export interface EKYCResponse {
  code: string;
  message: string;
  information: InformationResponse;
  verification: FaceVerificationResponse;
}
export interface InformationResponse {
  id: string;
  name: string;
  birthday: string; 
  nationality: string;
  sex: string;
  address: string;
  expiry: string;
}

export interface FaceVerificationResponse {
  verifyResult: string;
  score: number;
}