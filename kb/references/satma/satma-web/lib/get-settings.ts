import { getPayloadClient } from "@/lib/payload-client";
import { site } from "@/lib/site";

type CMSSocials = {
  instagram?: string;
  facebook?: string;
  x?: string;
  linkedin?: string;
};

type CMSSettings = {
  siteName?: string;
  tagline?: string;
  description?: string;
  email?: string;
  phone?: string;
  phoneAlt?: string;
  addressStreet?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
} & CMSSocials;

export type ResolvedSettings = ReturnType<typeof toSettings>;

function toSettings(cms: CMSSettings | null | undefined) {
  return {
    siteName: cms?.siteName ?? site.fullName,
    tagline: cms?.tagline ?? "Marketing humano. Potenciado con IA.",
    description: cms?.description ?? site.description,
    contact: {
      email: cms?.email ?? site.contact.email,
      phone: cms?.phone ?? site.contact.phone,
      phoneAlt: cms?.phoneAlt ?? site.contact.phoneAlt,
      address: {
        street: cms?.addressStreet ?? site.contact.address.street,
        neighborhood:
          cms?.addressNeighborhood ?? site.contact.address.neighborhood,
        city: cms?.addressCity ?? site.contact.address.city,
        state: cms?.addressState ?? site.contact.address.state,
        zip: cms?.addressZip ?? site.contact.address.zip,
      },
    },
    socials: {
      instagram: cms?.instagram || site.socials.instagram,
      facebook: cms?.facebook || site.socials.facebook,
      x: cms?.x || site.socials.x,
      linkedin: cms?.linkedin || site.socials.linkedin,
    },
  };
}

/**
 * Returns the resolved settings (CMS values, falling back to local config).
 * Use in any server component that needs site-wide data.
 */
export async function getSettings() {
  try {
    const payload = await getPayloadClient();
    const cms = (await payload.findGlobal({
      slug: "settings",
      overrideAccess: true,
    })) as CMSSettings | null;
    return toSettings(cms);
  } catch {
    return toSettings(null);
  }
}
