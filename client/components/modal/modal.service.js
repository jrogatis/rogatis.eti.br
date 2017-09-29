'use strict';

import angular from 'angular';

export const Modal = ($rootScope, $uibModal) => {
  /**
   * Opens a modal
   * @param  {Object} scope      - an object to be merged with modal's scope
   * @param  {String} modalClass - (optional) class(es) to be applied to the modal
   * @return {Object}            - the instance $uibModal.open() returns
   */
  const openModal = (scope = {}, modalClass = 'modal-default') => {
    const modalScope = $rootScope.$new();

    angular.extend(modalScope, scope);

    return $uibModal.open({
      template: require('./modal.pug'),
      windowClass: modalClass,
      scope: modalScope
    });
  };

  // Public API here
  return {

    imageGalleryList: (index = angular.noop, ...args) => {
      // const args = Array.prototype.slice.call(...args);
      const name = args.shift();

      return () => { };
    },

    /* Confirmation modals */
    confirm: {

      /**
       * Create a function to open a delete confirmation modal (ex. ng-click='myModalFn(name, arg1, arg2...)')
       * @param  {Function} del - callback, ran when delete is confirmed
       * @return {Function}     - the function to open the modal (ex. myModalFn)
       */
      delete(del = angular.noop) {
        /**
         * Open a delete confirmation modal
         * @param  {String} name   - name or info to show on modal
         * @param  {All}           - any additional args are passed straight to del callback
         */
        return () => {
          const args = Array.prototype.slice.call(...args);
          const name = args.shift();
          let deleteModal;

          deleteModal = openModal({
            modal: {
              dismissable: true,
              title: 'Confirm Delete',
              html: `<p>Are you sure you want to delete <strong>${name}</strong> ?</p>`,
              buttons: [{
                classes: 'btn-danger',
                text: 'Delete',
                click(e) {
                  deleteModal.close(e);
                }
              }, {
                classes: 'btn-default',
                text: 'Cancel',
                click(e) {
                  deleteModal.dismiss(e);
                }
              }]
            }
          }, 'modal-danger');

          deleteModal.result.then(event => del.apply(event, args)
          );
        };
      }
    }
  };
};

export default angular.module('rogatisEtiBrApp.Modal', [])
  .factory('Modal', Modal)
  .name;
