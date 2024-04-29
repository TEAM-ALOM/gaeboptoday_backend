import { IsString } from "class-validator";

class CreateUserDto {
  @IsString()
  name: string
}

export default CreateUserDto;