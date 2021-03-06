import _ from 'lodash';

import LazyLoad from '../src/lazyload';

import checkCalls from '@djforth/morse-jasmine-wp/check_calls';
import {createHolder as createEl} from '@djforth/morse-jasmine-wp/create_elements';
import {removeElement as removeEl} from '@djforth/morse-jasmine-wp/create_elements';
import sim_event from '@djforth/morse-jasmine-wp/simulate_click';
import Stubs from '@djforth/morse-jasmine-wp/stub_inner';
const stubs = Stubs(LazyLoad);

describe('Lazyload', function(){
  let el, spy;

  describe('when there is a node', function(){
    beforeEach(function(){
      spy = jasmine.createSpy('click');
      el = createEl('gmaps');
      stubs.addSpy(['addLoader', 'removeLoader']);
      LazyLoad(el, 'click', spy);
    });

    afterEach(function(){
      removeEl(el);
      stubs.revertAll();
    });

    it('should call spy on click', function(){
      sim_event(el, 'click');
      expect(spy).toHaveBeenCalled();
    });

    it('should call removeLoader', function(){
      sim_event(el, 'click');
      var calls = spy.calls.argsFor(0)[0];
      calls();
      let rl =  stubs.getSpy('removeLoader');
      expect(rl).toHaveBeenCalledWith(el);
    });

    checkCalls(()=>{
      sim_event(el, 'click');
      return stubs.getSpy('addLoader');
    }, 'add Loader', ()=>[el]);

    it('should remove event after first interaction', function(){
      sim_event(el, 'click');
      sim_event(el, 'click');
      expect(spy.calls.count()).toEqual(1);
    });
  });

  describe('when there is no element', function(){
    beforeEach(function(){
      spy = jasmine.createSpy('click');
      el = createEl('gmaps');
      // console.log(el.parentNod)
      LazyLoad(null, 'click', spy);
    });

    afterEach(function(){
      removeEl(el);
    });

    it('should not apply any event if no element applied', function(){
      sim_event(el, 'click');
      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('add & remove loader class ', function(){
    let addLoader, removeLoader;
    beforeEach(function(){
      addLoader    = LazyLoad.__get__('addLoader');
      removeLoader = LazyLoad.__get__('removeLoader');
      el = createEl('gmaps');
    });

    it('should add loader class', function(){
      addLoader(el);
      expect(el.className).toContain('loader');
    });

    it('should remove loader class', function(){
      el.classname += ' loader';
      removeLoader(el);
      expect(el.className).not.toContain('loader');
    });
  });
});
