# Intégration Frontend Blog AutoDrive

## Vue d'ensemble

L'intégration frontend du module blog comprend :
- **Pages publiques** : Liste des articles avec recherche/pagination, lecture d'article
- **Administration** : CRUD complet avec upload d'images et gestion des statuts
- **Authentification** : Injection automatique du token JWT
- **Gestion d'erreurs** : États de chargement et messages d'erreur

## Architecture

### Hooks personnalisés
- `useAuth()` : Gestion de l'authentification et du token JWT
- `useBlogList()` : Liste des articles avec pagination et recherche
- `useBlogPost()` : Récupération d'un article par slug
- `useBlogAdmin()` : Opérations CRUD admin

### Service API
- `blogApi` : Service centralisé pour toutes les opérations blog
- Intercepteurs automatiques pour l'authentification
- Gestion d'erreurs unifiée

## Pages

### Publique : `/blog`
- Liste paginée des articles publiés
- Recherche par titre/contenu
- Filtrage par tags
- États de chargement et d'erreur

### Publique : `/blog/article/:slug`
- Affichage complet d'un article
- Gestion des erreurs 404
- Meta données (auteur, date, tags)

### Admin : `/admin/blog`
- Liste de tous les articles (publiés/brouillons)
- CRUD complet avec formulaire
- Upload d'images
- Publication/dépublication

## Composants UI

### BlogList (`/pages/blog/blog.tsx`)
```tsx
// Recherche avec debounce
// Pagination complète
// Filtres par tags
// États de chargement
```

### BlogArticle (`/pages/blog/article.tsx`)
```tsx
// Affichage responsive
// Gestion d'erreurs
// Navigation
// Meta informations
```

### AdminBlog (`/pages/admin/blog.tsx`)
```tsx
// Formulaire complet avec validation
// Upload d'images
// Gestion des tags
// Actions CRUD
```

## API Endpoints

### Routes publiques
```typescript
GET /blog?page=1&limit=10&q=search&tags=tag1,tag2
GET /blog/:slug
```

### Routes admin (JWT requis)
```typescript
POST   /admin/blog
PUT    /admin/blog/:id
DELETE /admin/blog/:id
PATCH  /admin/blog/:id/publish
POST   /admin/blog/upload
```

## Authentification

### Token JWT
- Stockage automatique dans `localStorage`
- Injection automatique dans les headers
- Intercepteur pour gérer les erreurs 401

### Guards
- Redirection automatique vers login si non authentifié
- Vérification du rôle admin pour les routes admin

## Gestion d'état

### Loading States
- Squelettes de chargement
- Indicateurs de progression
- États d'erreur avec retry

### Form Validation
- Validation frontend avec messages d'erreur
- Validation backend avec affichage des erreurs
- Gestion des erreurs de validation DTO

## Upload d'images

### Processus
1. Sélection du fichier côté frontend
2. Upload vers `/admin/blog/upload`
3. Récupération de l'URL
4. Intégration dans le formulaire

### Validation
- Types de fichiers autorisés (jpg, png, gif)
- Taille maximale
- Gestion d'erreurs

## Tests

### Tests manuels recommandés

#### Frontend
```bash
# Liste des articles
curl "http://localhost:5173/blog"

# Recherche
curl "http://localhost:5173/blog?q=voiture"

# Article individuel
curl "http://localhost:5173/blog/article/slug-test"
```

#### API (avec token)
```bash
# Créer un article
curl -X POST http://localhost:9000/admin/blog \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","slug":"test","body":"<p>Test</p>","tags":["test"]}'

# Upload image
curl -X POST http://localhost:9000/admin/blog/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "file=@image.jpg"
```

## Déploiement

### Variables d'environnement
```env
VITE_API_BASE_URL=http://localhost:9000
```

### Build
```bash
npm run build
```

## Bonnes pratiques implémentées

- ✅ Séparation des responsabilités (hooks, services, composants)
- ✅ Gestion d'erreurs complète
- ✅ États de chargement
- ✅ Validation des formulaires
- ✅ Authentification sécurisée
- ✅ Responsive design
- ✅ Accessibilité
- ✅ Performance (debounce, cache)

## TODO / Améliorations futures

- [ ] Articles similaires
- [ ] Commentaires
- [ ] Partage sur réseaux sociaux
- [ ] SEO amélioré
- [ ] Cache avec React Query
- [ ] Tests unitaires
- [ ] Internationalisation