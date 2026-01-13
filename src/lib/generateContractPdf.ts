import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

async function fetchImageAsDataUrl(url: string | undefined): Promise<string | null> {
  if (!url) return null;
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const blob = await resp.blob();
    return await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    console.error('fetchImageAsDataUrl error', e);
    return null;
  }
}

export async function generateContractPdf(contract: any, options?: { agency?: any; agenciesService?: any; mapsUrl?: string; agencyLogoUrl?: string }) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();

  // Resolve agency data and google maps URL
  let agencyData: any = options && options.agency ? options.agency : undefined;
  let googleMapsUrl: string | undefined = options && options.mapsUrl ? options.mapsUrl : undefined;
  try {
    if (options && options.agenciesService) {
      const res = await options.agenciesService.findAll({ isActive: true, limit: 1 });
      agencyData = res && res.data && res.data.length ? res.data[0] : agencyData;
      if (agencyData && agencyData.location && agencyData.location.latitude && agencyData.location.longitude) {
        googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${agencyData.location.latitude},${agencyData.location.longitude}`;
      }
    }
  } catch (e) {
    console.warn('generateContractPdf: unable to fetch active agency', e);
  }

  // Fallback: if no active agency found, try to fetch by contract.agenceId when possible
  if (!agencyData && options && options.agenciesService && contract && (contract.agenceId || contract.agence)) {
    try {
      const id = contract.agenceId || contract.agence;
      if (typeof options.agenciesService.findOne === 'function') {
        const res2 = await options.agenciesService.findOne(id);
        agencyData = res2 && (res2.data || res2);
      } else if (typeof options.agenciesService.findById === 'function') {
        const res2 = await options.agenciesService.findById(id);
        agencyData = res2 && (res2.data || res2);
      } else if (typeof options.agenciesService.get === 'function') {
        const res2 = await options.agenciesService.get(id);
        agencyData = res2 && (res2.data || res2);
      }
      if (agencyData && agencyData.location && agencyData.location.latitude && agencyData.location.longitude) {
        googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${agencyData.location.latitude},${agencyData.location.longitude}`;
      }
    } catch (e) {
      console.warn('generateContractPdf: unable to fetch agency by id', e);
    }
  }

  // Header: logo + title
  const logoUrl = (agencyData && (agencyData.logo || agencyData.logoUrl)) || (options && options.agencyLogoUrl);
  const logoData = await fetchImageAsDataUrl(logoUrl);
  if (logoData) {
    try {
      doc.addImage(logoData, 'PNG', margin, 30, 120, 50);
    } catch (e) {
      // ignore
    }
  }

  doc.setFontSize(18);
  doc.text('CONTRAT DE LOCATION DE VÉHICULE', pageWidth / 2, 60, { align: 'center' });

  let y = 110;
  doc.setFontSize(12);

  // Agency info (prefer active agency data when available)
  doc.setFillColor(245, 245, 245);
  doc.rect(margin, y - 6, pageWidth - margin * 2, 80, 'F');
  doc.setTextColor(40, 40, 40);
  doc.text("Informations de l'agence", margin + 6, y + 6);
  const agencyName = (agencyData && (agencyData.nom || agencyData.name)) || contract.agenceNom || 'AutoDrive';
  const agencyAddress = (agencyData && (agencyData.adresse || agencyData.address || agencyData.addressLine)) || contract.agenceAdresse || 'Non spécifiée';
  const agencyPhone = (agencyData && (agencyData.telephone || agencyData.phone)) || contract.agenceTelephone || 'Non spécifié';
  const agencyEmail = (agencyData && (agencyData.email)) || contract.agenceEmail || 'Non spécifié';
  const agencyLines = [
    `Nom: ${agencyName}`,
    `Adresse: ${agencyAddress}`,
    `Téléphone: ${agencyPhone}`,
    `Email: ${agencyEmail}`,
  ];
  doc.setFontSize(10);
  agencyLines.forEach((line, i) => doc.text(line, margin + 6, y + 22 + i * 14));
  if (googleMapsUrl) {
    doc.setTextColor(0, 102, 204);
    doc.text('Itinéraire: ' + googleMapsUrl, margin + 6, y + 22 + agencyLines.length * 14);
    doc.setTextColor(40, 40, 40);
  }
  y += 100;

  // Client info
  doc.setFontSize(12);
  doc.text('Informations du client', margin + 6, y);
  doc.setFontSize(10);
  const user = contract.userId || {};
  doc.text(`Nom: ${user.prenom || ''} ${user.nom || ''}`, margin + 6, y + 16);
  doc.text(`Email: ${user.email || ''}`, margin + 6, y + 32);
  doc.text(`Téléphone: ${user.telephone || ''}`, margin + 6, y + 48);
  y += 76;

  // Vehicle info
  doc.setFontSize(12);
  doc.text('Informations du véhicule', margin + 6, y);
  doc.setFontSize(10);
  if (contract.vehicleId) {
    doc.text(`Marque: ${contract.vehicleId.marque || ''}`, margin + 6, y + 16);
    doc.text(`Modèle: ${contract.vehicleId.modele || ''}`, margin + 6, y + 32);
    doc.text(`Immatriculation: ${contract.vehicleId.immatriculation || ''}`, margin + 6, y + 48);
  } else {
    doc.text('Véhicule à définir lors de la réservation', margin + 6, y + 16);
  }
  y += 76;

  // Period & amounts table
  const periodRows = [
    ['Période', `${new Date(contract.dateDebut).toLocaleDateString('fr-FR')} → ${new Date(contract.dateFin).toLocaleDateString('fr-FR')}`],
    ['Montant total', `${contract.montantTotal ?? ''} €`],
    ['Acompte versé', `${contract.acompteVerse ?? 0} €`],
    ['Statut', `${contract.statut ?? ''}`],
  ];

  autoTable(doc as any, {
    startY: y,
    theme: 'striped',
    head: [['Clé', 'Valeur']],
    body: periodRows,
    styles: { fontSize: 10 },
    headStyles: { fillColor: [230, 230, 230] },
    margin: { left: margin, right: margin },
  });

  // Footer / signature
  const finalY = (doc as any).lastAutoTable ? (doc as any).lastAutoTable.finalY + 30 : y + 120;
  doc.setFontSize(10);
  doc.text(`Date de validation: ${contract.dateValidation ? new Date(contract.dateValidation).toLocaleDateString('fr-FR') : 'Non validé'}`, margin + 6, finalY);
  if (contract.validePar && contract.validePar.nom) {
    doc.text(`Validé par: ${contract.validePar.prenom || ''} ${contract.validePar.nom || ''}`, margin + 6, finalY + 16);
  }

  return doc;
}

export default generateContractPdf;
