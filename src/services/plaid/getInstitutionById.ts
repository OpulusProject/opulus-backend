import { CountryCode, InstitutionsGetByIdRequest } from "plaid";

import { plaid } from "./plaid";

export async function getInstitutionById(institutionId: string) {
  const request: InstitutionsGetByIdRequest = {
    institution_id: institutionId,
    country_codes: [CountryCode.Ca],
  };

  return await plaid.institutionsGetById(request);
}
