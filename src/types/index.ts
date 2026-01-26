export interface Link {
  id: string;
  title: string;
  url: string;
  icon: string; // We'll store the icon name as a string (e.g., "Github", "Twitter")
  type: string; // "classic", "icon", "header"
  order: number;
  enabled: boolean;
  thumbnail?: string | null; // URL to favicon/logo image for the link

  // Individual link customization (overrides profile defaults)
  buttonColor?: string | null;
  textColor?: string | null;
  borderColor?: string | null;
  borderStyle?: string | null;
  buttonStyle?: string | null;
  shadow?: string | null;
  shadowColor?: string | null; // New field
  animation?: string | null;
  iconColor?: string | null;
  borderWidth?: number | null; // New field
}

export interface Profile {
  id: string;
  username: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;

  // Background customization
  backgroundColor: string;
  backgroundType: string;
  backgroundGradient: string | null;
  backgroundImage: string | null;

  // Profile card customization
  profileTextColor: string;
  profileAccentColor: string;
  profileBioColor: string;

  // Font customization
  fontFamily: string;

  // Avatar customization
  avatarBorderColor: string;
  avatarBorderWidth: number;

  // Global link button style defaults
  linkButtonStyle: string;
  linkButtonColor: string;
  linkButtonTextColor: string;
  linkButtonBorder: string;
  linkButtonBorderColor: string;
  linkButtonShadow: string;
  linkButtonShadowColor?: string; // New field
  linkButtonAnimation: string;
  linkButtonBorderWidth?: number; // New field

  links: Link[];
}
