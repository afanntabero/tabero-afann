import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Lock, Loader2, ArrowLeft, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';

export default function AdminLogin() {
  const { t } = useLanguage();
  const { signIn } = useAuth();

  // États du formulaire
  const [isRegistering, setIsRegistering] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Champs de saisie
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Masquer / Afficher les mots de passe
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // États de chargement et messages
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // Gestion de la soumission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // 1. CAS : Mot de passe oublié
    if (isForgotPassword) {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin`,
      });
      if (resetErr) {
        setError(resetErr.message);
      } else {
        setMessage('Un e-mail de réinitialisation vous a été envoyé.');
      }
      setLoading(false);
      return;
    }

    // 2. CAS : Création de compte (Inscription)
    if (isRegistering) {
      if (password !== confirmPassword) {
        setError('Les mots de passe ne correspondent pas.');
        setLoading(false);
        return;
      }

      const { error: err } = await supabase.auth.signUp({ email, password });
      if (err) {
        setError(err.message);
      } else {
        setMessage('Compte créé avec succès ! Si un e-mail de confirmation est requis, vérifiez votre boîte mail.');
      }
      setLoading(false);
      return;
    }

    // 3. CAS : Connexion normale
    const { error: err } = await signIn(email, password);
    if (err) setError(err);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-neon-cyan/15 rounded-full blur-[100px]" />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-neon mb-6 animate-glow-pulse">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-display font-bold text-white mb-2">
            {isForgotPassword 
              ? 'Réinitialisation' 
              : isRegistering 
                ? 'Créer un compte Admin' 
                : t.admin.login.title}
          </h1>
          <p className="text-gray-400 text-sm">
            {isForgotPassword 
              ? 'Entrez votre email pour recevoir un lien de réinitialisation' 
              : isRegistering 
                ? 'Inscrivez votre compte administrateur' 
                : t.admin.login.subtitle}
          </p>
        </div>

        {/* Formulaire principal */}
        <form onSubmit={handleSubmit} className="glass-strong rounded-2xl p-8 space-y-5">
          {/* Champ Email */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">{t.admin.login.email}</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40 transition-all"
            />
          </div>

          {/* Champs Mot de passe (Masqués si "Mot de passe oublié") */}
          {!isForgotPassword && (
            <>
              {/* Mot de passe */}
              <div>
                <label className="block text-sm text-gray-400 mb-2">{t.admin.login.password}</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Confirmation Mot de passe (Si Inscription) */}
              {isRegistering && (
                <div>
                  <label className="block text-sm text-gray-400 mb-2">Confirmer le mot de passe</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 pr-11 rounded-xl bg-white/[0.03] border border-white/[0.08] text-white focus:outline-none focus:border-neon-purple/40 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Lien Mot de passe oublié (uniquement en mode Connexion) */}
          {!isRegistering && !isForgotPassword && (
            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(true);
                  setError(null);
                  setMessage(null);
                }}
                className="text-xs text-neon-purple hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
          )}

          {/* Messages d'erreur et de succès */}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-emerald-400">{message}</p>}

          {/* Bouton de soumission */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : isForgotPassword ? (
              <KeyRound size={16} />
            ) : (
              <Lock size={16} />
            )}
            {loading
              ? 'Veuillez patienter...'
              : isForgotPassword
                ? 'Envoyer le lien'
                : isRegistering
                  ? 'S\'inscrire'
                  : t.admin.login.signIn}
          </button>

          {/* Basculer entre Se connecter / S'inscrire / Retour */}
          <div className="pt-2 text-center text-xs text-gray-400 space-y-2">
            {isForgotPassword ? (
              <button
                type="button"
                onClick={() => {
                  setIsForgotPassword(false);
                  setError(null);
                  setMessage(null);
                }}
                className="text-white hover:underline block w-full text-center"
              >
                ← Retour à la connexion
              </button>
            ) : (
              <p>
                {isRegistering ? 'Déjà un compte ? ' : 'Pas encore de compte ? '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegistering(!isRegistering);
                    setError(null);
                    setMessage(null);
                  }}
                  className="text-neon-purple font-semibold hover:underline"
                >
                  {isRegistering ? 'Se connecter' : 'Créer un compte'}
                </button>
              </p>
            )}
          </div>
        </form>

        <Link to="/" className="mt-6 flex items-center justify-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> {t.admin.login.backHome}
        </Link>
      </div>
    </div>
  );
}