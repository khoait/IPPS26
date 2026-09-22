declare global {
  interface Window {
    IPPS: {
      CaseManagement: Record<string, any>;
    };
  }
}

export {};
