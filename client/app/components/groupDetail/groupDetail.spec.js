import GroupDetailModule from "./groupDetail";
import GroupDetailController from "./groupDetail.controller";
import GroupDetailComponent from "./groupDetail.component";
import GroupDetailTemplate from "./groupDetail.html";

const { module } = angular.mock;

describe("GroupDetail", () => {

  let $httpBackend, $state;

  beforeEach(module(GroupDetailModule));

  beforeEach(inject(($injector) => {
    $httpBackend = $injector.get("$httpBackend");
    $state = $injector.get("$state");
    sinon.stub($state, "go");
  }));

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  describe("Component", () => {
    let component = GroupDetailComponent;

    it("includes the intended template",() => {
      expect(component.template).to.equal(GroupDetailTemplate);
    });

    it("invokes the right controller", () => {
      expect(component.controller).to.equal(GroupDetailController);
    });

  });

  describe("Controller", () => {

    let CurrentGroup, $ctrl;

    beforeEach(inject(($componentController, _CurrentGroup_) => {
      CurrentGroup = _CurrentGroup_;
      $ctrl = $componentController("groupDetail", {});
    }));

    it("should exist", () => {
      expect($ctrl).to.exist;
    });

    it("should be able to leave a group", () => {
      let groupId = 9834;
      $httpBackend.expectPOST(`/api/groups/${groupId}/leave/`).respond(200);
      Object.assign($ctrl, { groupId });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect($state.go).to.have.been.calledWith("home");
    });

    it("clears the current group if you leave it", () => {
      let groupId = 2424;
      $httpBackend.expectPOST(`/api/groups/${groupId}/leave/`).respond(200);
      CurrentGroup.set({ id: groupId });
      expect(CurrentGroup.value).to.deep.equal({ id: groupId });
      Object.assign($ctrl, { groupId });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect(CurrentGroup.value).to.deep.equal({});
      expect($state.go).to.have.been.calledWith("home");
    });

    it("sets an error flag if leaving fails", () => {
      let groupId = 98238;
      $httpBackend.expectPOST(`/api/groups/${groupId}/leave/`).respond(400);
      Object.assign($ctrl, { groupId });
      $ctrl.leaveGroup();
      $httpBackend.flush();
      expect($ctrl.error.leaveGroup).to.be.true;
      expect($state.go).to.not.have.been.called;
    });

  });

});