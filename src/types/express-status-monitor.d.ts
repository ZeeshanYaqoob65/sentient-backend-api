declare module "express-status-monitor" {
  import { Express } from "express";

  interface ExpressStatusMonitorOptions {
    title?: string;
    path?: string;
    spans?: Array<{ interval: number; retention: number }>;
    chartVisibility?: {
      cpu?: boolean;
      mem?: boolean;
      load?: boolean;
      heap?: boolean;
      responseTime?: boolean;
      rps?: boolean;
      statusCodes?: boolean;
    };
    healthChecks?: Array<{
      protocol: string;
      host: string;
      path: string;
      port: number;
    }>;
  }

  function expressStatusMonitor(
    options?: ExpressStatusMonitorOptions
  ): (req: any, res: any, next: any) => void;

  export = expressStatusMonitor;
}
