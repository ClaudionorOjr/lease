import { EditProfile } from '@/domain/account/application/use-cases/edit-profile';
import { container } from 'tsyringe';
import type {
  EditProfileReply,
  EditProfileRequest,
} from '../../schemas/account/edit-profile-schema';

export async function editProfileController(
  request: EditProfileRequest,
  reply: EditProfileReply,
) {
  const { sub: userId } = request.user;
  const { fullName, phone } = request.body;

  const editProfile = container.resolve(EditProfile);

  const result = await editProfile.execute({ userId, fullName, phone });

  if (result.isFailure()) {
    throw result.value;
  }

  return reply.status(204).send();
}
