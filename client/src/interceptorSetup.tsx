import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setupInterceptors } from "./API/AxiosIntance";

const InterceptorSetup: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return null;
};

export default InterceptorSetup;

export {};
