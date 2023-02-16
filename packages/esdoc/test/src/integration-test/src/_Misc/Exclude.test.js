import { expect } from 'chai';
import {find} from '../../../../util';

describe('test/_Misc/Exclude:', function () {
  it('not exist', function () {
    expect( () => { return find('longname', 'src[\\|/]_Misc[\\|/]Exclude.js~TestExclude'); } ).to.throw();
  });
});
