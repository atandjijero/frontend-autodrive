declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

declare module "file-saver";
declare module "xlsx";