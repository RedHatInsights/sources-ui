import { axiosInstance } from '../api/entities';

const getToken = () => window.marketplacetoken || 'xxx';

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

export const getProducts = () =>
  axiosInstance.post(
    'https://sandbox.marketplace.redhat.com/catalog/gql',
    { query },
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
