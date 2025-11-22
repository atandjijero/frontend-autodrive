export default function ProfilPage() {
  const adminEmail = "admin@autodrive.com" // ⚠️ à remplacer par ton auth réel

  return (
    <div>
      <h1 className="text-2xl font-bold">Profil Admin 👤</h1>
      <p>Email : {adminEmail}</p>
      <p>Rôle : Administrateur</p>
      <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
        Modifier le profil
      </button>
    </div>
  )
}
