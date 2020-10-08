import userReducer, { defaultUserState } from '../../../redux/user/reducer';
import { ACTION_TYPES } from '../../../redux/user/actionTypes';

describe('userReducer', () => {
  let result;

  it('resets state when pending', () => {
    result = userReducer[ACTION_TYPES.SET_ORG_ADMIN_PENDING]({
      ...defaultUserState,
      isOrgAdmin: 'nonsense',
    });

    expect(result).toEqual({
      ...defaultUserState,
      isOrgAdmin: undefined,
    });
  });

  it('sets isOrgAdmin when true', () => {
    result = userReducer[ACTION_TYPES.SET_ORG_ADMIN_FULFILLED](defaultUserState, { payload: true });

    expect(result).toEqual({
      ...defaultUserState,
      isOrgAdmin: true,
    });
  });

  it('sets isOrgAdmin when false', () => {
    result = userReducer[ACTION_TYPES.SET_ORG_ADMIN_FULFILLED](defaultUserState, { payload: false });

    expect(result).toEqual({
      ...defaultUserState,
      isOrgAdmin: false,
    });
  });

  it('resets state when rejected', () => {
    result = userReducer[ACTION_TYPES.SET_ORG_ADMIN_REJECTED]({
      ...defaultUserState,
      isOrgAdmin: 'nonsense',
    });

    expect(result).toEqual({
      ...defaultUserState,
      isOrgAdmin: undefined,
    });
  });
});
