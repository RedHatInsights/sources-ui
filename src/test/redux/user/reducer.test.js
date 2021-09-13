import userReducer, { defaultUserState } from '../../../redux/user/reducer';
import { ACTION_TYPES } from '../../../redux/user/actionTypes';

describe('userReducer', () => {
  let result;

  it('resets state when pending', () => {
    result = userReducer[ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING]({
      ...defaultUserState,
      writePermissions: 'nonsense',
    });

    expect(result).toEqual({
      ...defaultUserState,
      writePermissions: undefined,
    });
  });

  it('sets permissions when true', () => {
    result = userReducer[ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED](defaultUserState, { payload: true });

    expect(result).toEqual({
      ...defaultUserState,
      writePermissions: true,
    });
  });

  it('sets permissions when false', () => {
    result = userReducer[ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED](defaultUserState, { payload: false });

    expect(result).toEqual({
      ...defaultUserState,
      writePermissions: false,
    });
  });

  it('resets state when rejected', () => {
    result = userReducer[ACTION_TYPES.SET_WRITE_PERMISSIONS_REJECTED]({
      ...defaultUserState,
      writePermissions: 'nonsense',
    });

    expect(result).toEqual({
      ...defaultUserState,
      writePermissions: undefined,
    });
  });
});
