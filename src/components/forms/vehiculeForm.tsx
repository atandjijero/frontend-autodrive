import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { vehicules } from "@/pages/admin/vehiculesListe";
import { useParams } from "react-router-dom";

export function VehiculeForm() {
  const { id } = useParams();
  const vehicule = id ? vehicules[Number(id)] : null;

  const [inputs, setInputs] = useState({
    carrosserie: vehicule?.carrosserie ?? "",
    marque: vehicule?.marque ?? "",
    transmission: vehicule?.transmission ?? "",
    prix: vehicule?.prix ?? 0,
    imageUrl: vehicule?.imageUrl ?? "",
    immatriculation: vehicule?.immatriculation ?? "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <FieldGroup>
      <InputTextMarque inputs={inputs} handleChange={handleChange} />
      <InputTextCarrosserie inputs={inputs} handleChange={handleChange} />
      <InputTextImmatriculation inputs={inputs} handleChange={handleChange} />
      <InputNumberPrix inputs={inputs} handleChange={handleChange} />
      <InputTextImageUrl inputs={inputs} handleChange={handleChange} />
      <InputTextTransmission inputs={inputs} handleChange={handleChange} />
    </FieldGroup>
  );
}

export function InputTextMarque({
  inputs,
  handleChange,
}: {
  inputs: { marque: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor="marque">Marque</FieldLabel>
      <Input
        id="marque"
        type="text"
        onChange={handleChange}
        value={inputs.marque}
        placeholder="Toyota"
        required
      />
      <p>{inputs.marque}</p>
    </Field>
  );
}

export function InputTextCarrosserie({
  inputs,
  handleChange,
}: {
  inputs: { carrosserie: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor="carrosserie">Carrosserie</FieldLabel>
      <Input
        id="carrosserie"
        type="text"
        onChange={handleChange}
        value={inputs.carrosserie}
        placeholder="SUV"
        required
      />
      <p>{inputs.carrosserie}</p>
    </Field>
  );
}

export function InputTextImmatriculation({
  inputs,
  handleChange,
}: {
  inputs: { immatriculation: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor="immatriculation">Immatriculation</FieldLabel>
      <Input
        id="immatriculation"
        type="text"
        onChange={handleChange}
        value={inputs.immatriculation}
        placeholder="AB-123-CD"
        required
      />
      <p>{inputs.immatriculation}</p>
    </Field>
  );
}

export function InputNumberPrix({
  inputs,
  handleChange,
}: {
  inputs: { prix: number };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor="prix">Prix</FieldLabel>
      <Input
        id="prix"
        type="number"
        onChange={handleChange}
        value={inputs.prix}
        placeholder="20000"
        required
      />
    </Field>
  );
}

export function InputTextImageUrl({
  inputs,
  handleChange,
}: {
  inputs: { imageUrl: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor="imageUrl">imageUrl</FieldLabel>
      <Input
        id="imageUrl"
        type="text"
        onChange={handleChange}
        value={inputs.imageUrl}
        placeholder="/images/voiture1.jpg"
        required
      />
      <p>{inputs.imageUrl}</p>
    </Field>
  );
}

export function InputTextTransmission({
  inputs,
  handleChange,
}: {
  inputs: { transmission: string };
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Field>
      <FieldLabel htmlFor="transmission">Transmission</FieldLabel>
      <Input
        id="transmission"
        type="text"
        onChange={handleChange}
        value={inputs.transmission}
        placeholder="Automatique"
        required
      />
      <p>{inputs.transmission}</p>
    </Field>
  );
}
