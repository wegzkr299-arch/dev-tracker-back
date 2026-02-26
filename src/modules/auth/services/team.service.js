const Developer = require("../repositories/auth.repository")
const ApiError = require("../../../utils/apiErrors")
const InvitationRepo = require("../repositories/invitations.repository");
const sendInvite = async (adminId, recipientEmail) => {
    const emailLower = recipientEmail.toLowerCase().trim();
    if(!adminId || !emailLower){
        throw new ApiError(400 , "admin and developer email are requierd")
    }
    const admin  = await Developer.findUserById(adminId);
    if(admin.email === emailLower){
        throw new ApiError(400 , "you cannot send invitation to yourself")
    }
    const recipient = await Developer.findUserByEmail(emailLower);
    if(!recipient){
        throw new ApiError(404 , "cannot find user by this email")
    }

    const isAlreadyMember = recipient.teams.some(
    (t) => t.adminId.toString() === adminId.toString()
  );
  if (isAlreadyMember) {
    throw new ApiError(400, "this developer already in your team");
  }

  const existingInvite = await InvitationRepo.findPendingInvite(adminId, emailLower);
  if (existingInvite) {
    throw new ApiError(400, "An invitation is already pending for this developer");
  }

  return await InvitationRepo.createInvitation(adminId, emailLower);



}



const respondToInvite = async (userId, invitationId, decision) => {
  // 1. البحث عن الدعوة
  if(!decision || !invitationId){
    throw new ApiError(400 , "decision or task are not defined")
  }
  const invitation = await InvitationRepo.findInviteById(invitationId);
  if (!invitation || invitation.status !== "pending") {
    throw new ApiError(400, "This invitation is no longer valid or has already been processed.");
  }

  // 2. التأكد أن المطور الحالي هو صاحب الدعوة
  const user = await Developer.findUserById(userId);
  if (user.email !== invitation.recipientEmail) {
    throw new ApiError(403, "You are not authorized to respond to this invitation.");
  }

  if (decision === "accept") {
    // 3. إضافة المطور لفريق الأدمن (مع الصلاحيات الافتراضية)
    const alreadyInTeam = user.teams.some(t => t.adminId.toString() === invitation.sender.toString());
    
    if (!alreadyInTeam) {
      user.teams.push({ 
        adminId: invitation.sender,
        permissions: { canManageTasks: true } // صلاحية افتراضية
      });
      await user.save();
    }

    // 4. تحديث حالة الدعوة لـ Accepted
    await InvitationRepo.updateInvitationStatus(invitationId, "accepted");
    return { message: "Invitation accepted. You are now part of the team!" };
  } 
  
  else if (decision === "reject") {
    // 5. تحديث حالة الدعوة لـ Rejected
    await InvitationRepo.updateInvitationStatus(invitationId, "rejected");
    return { message: "Invitation rejected." };
  }

  throw new ApiError(400, "Invalid decision. Must be 'accept' or 'reject'.");
};


const getTeamMembers = async (adminId) => {
  // 1. التأكد من وجود الأدمن (خطوة اختيارية لزيادة الأمان)
  const admin = await Developer.findUserById(adminId);
  if (!admin) {
    throw new ApiError(404, "Admin not found");
  }

  // 2. جلب الأعضاء من الريبوزيتوري
  const members = await InvitationRepo.findTeamMembers(adminId);

  // 3. تنسيق البيانات (اختياري) عشان نرجع الصلاحيات بشكل أوضح
  const formattedMembers = members.map(member => ({
    id: member._id,
    name: member.name,
    email: member.email,
    joinedAt: member.teams[0].joinedAt,
    permissions: member.teams[0].permissions
  }));

  return formattedMembers;
};

const getMyInvitations = async (userId) => {
  const user = await Developer.findUserById(userId);
  if (!user) {
    throw new ApiError(404, "user not found");
  }

  const invitations = await InvitationRepo.findInvitesForUser(user.email);

  return invitations;
};

module.exports = {sendInvite , getMyInvitations , respondToInvite , getTeamMembers}