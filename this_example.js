const userService = {
  currentFilter: "active",
  users: [
    {
      name: "Alex",
      status: "active",
    },
    {
      name: "Nick",
      status: "deleted",
    },
  ],
  getFillteredUsers: function () {
    return this.users.filter(function (user) {
      return user.status === this.currentFilter;
    });
  },
};

console.log(userService.getFillteredUsers());

