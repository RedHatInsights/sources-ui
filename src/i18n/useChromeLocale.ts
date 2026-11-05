import { useChrome } from '@redhat-cloud-services/frontend-components/useChrome';

/**
 * The console language, resolved by Chrome's language detection flow
 * (RHCLOUD-52203) and exposed on the chrome API. Until that ships broadly
 * the property is undefined and we fall back to English.
 *
 * TODO: drop the cast when frontend-components types gain `language`.
 */
export function useChromeLocale(): string {
  const chrome = useChrome() as { language?: string } | undefined;
  return chrome?.language ?? 'en';
}
