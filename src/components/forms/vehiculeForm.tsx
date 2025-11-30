import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { vehicules } from "@/pages/admin/vehiculesListe";
import { useParams } from "react-router-dom";

export function VehiculeForm() {
  const { id } = useParams();
  const vehicule = id ? vehicules[Number(id)] : null;

  type Inputs = {
    carrosserie: string;
    marque: string;
    transmission: string;
    prix: number;
    imageUrl: string;
    immatriculation: string;
    imageFile: File | null;
  };

  const [inputs, setInputs] = useState<Inputs>({
    carrosserie: vehicule?.carrosserie ?? "",
    marque: vehicule?.marque ?? "",
    transmission: vehicule?.transmission ?? "",
    prix: vehicule?.prix ?? 0,
    imageUrl: vehicule?.imageUrl ?? "",
    immatriculation: vehicule?.immatriculation ?? "",
    imageFile: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setInputs(
      (prev) =>
        ({
          ...prev,
          [id]: id === "prix" ? Number(value) : value,
        }) as unknown as Inputs
    );
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setInputs((prev) => {
      // Revoke previous object URL if it was created from a File
      if (prev.imageFile && prev.imageUrl) {
        try {
          URL.revokeObjectURL(prev.imageUrl);
        } catch {}
      }

      const imageUrl = file ? URL.createObjectURL(file) : "";
      return { ...prev, imageFile: file, imageUrl };
    });
  };

  // Revoke object URL when component unmounts or when imageFile/imageUrl change
  useEffect(() => {
    return () => {
      if (inputs.imageFile && inputs.imageUrl) {
        try {
          URL.revokeObjectURL(inputs.imageUrl);
        } catch {}
      }
    };
  }, [inputs.imageFile, inputs.imageUrl]);

  return (
    <FieldGroup>
      <InputTextMarque inputs={inputs} handleChange={handleChange} />
      <InputTextCarrosserie inputs={inputs} handleChange={handleChange} />
      <InputTextImmatriculation inputs={inputs} handleChange={handleChange} />
      <InputNumberPrix inputs={inputs} handleChange={handleChange} />
      <InputTextTransmission inputs={inputs} handleChange={handleChange} />{" "}
      <Field>
        <FieldLabel htmlFor="image">Image</FieldLabel>
        <Input
          id="image"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          placeholder="Upload une image"
          required
        />
        {inputs.imageUrl ? (
          // simple preview when an image is selected or an existing URL is present
          // keep styling minimal; consumers can style as needed
          // eslint-disable-next-line jsx-a11y/img-redundant-alt
          <img
            src={inputs.imageUrl}
            alt="vehicle preview"
            style={{ maxWidth: 200, marginTop: 8 }}
          />
        ) : null}
      </Field>
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
