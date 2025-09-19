import jsPDF from "jspdf";

export const downloadQRCodePDF = (qrCode, eventName) =>{
    if(!qrCode || !eventName) return;

    const safeName = eventName.replace(/[^a-z0-9]/gi, "_").toLowerCase();

    const doc = new jsPDF();

    doc.setFontSize(40);
    doc.setFont("helvetica", "bold");
    const pageWidth = doc.internal.pageSize.getWidth();
    doc.text(eventName, pageWidth / 2, 20, { align: "center" });
  
    doc.addImage(qrCode, "PNG",25,40,160,160);
    doc.save(`${safeName}-qrcode.pdf`);
}