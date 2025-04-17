
import { useContext } from 'react';
// import { ThemeContext } from '../contexts/ThemeContext';
import { themeSombre } from '../themes/sombre';
import { COULEURS } from '../constants/couleurs';

export const useTheme = () => {
  // Normalement, on récupérerait le thème du contexte
  // Mais pour l'instant, nous utilisons directement le thème sombre
  // Cela pourra être amélioré pour supporter à la fois les thèmes sombre et clair
  return themeSombre;
};