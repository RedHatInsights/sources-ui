import { axiosInstance } from '../api/entities';
import { MARKETPLACE_URL } from './constants';

const getAccessToken = () =>
  axiosInstance.post(`${MARKETPLACE_URL}/api-security/om-auth/cloud/token`, {
    grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
    apikey: localStorage.getItem('marketplace-key'),
  });

const query = `
{
  productByIds (ids: [
    "ca54ff2ba24df884a96995f1eefd081b",
    "ccb29628eabe15c81121ecf231a0a8cd",
    "9e3b238934c288394680f3a53d1544e0",
    "bd44b472123b544a630a939c650e968e"
	]) {
    products {
      id
      productPageName
      publishedContent {
        title
        localizedContent {
          descriptions {
            short
          }
        }
        logo {
          url
        }
      }
      productRating {
        averageRating
      }
      primaryCategory {
        content { name }
      }
      company {
        displayName
      }
    }
  }
}`;

let access_token;

export const getProducts = async () => {
  if (!access_token) {
    const res = await getAccessToken();
    access_token = res.access_token;
  }

  return axiosInstance.post(
    `${MARKETPLACE_URL}/catalog/gql`,
    { query },
    { headers: { Authorization: `Bearer ${access_token}` } }
  );
};
