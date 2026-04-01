import * as z from 'zod';


export const inputZ = z.object({
  id: z.string(),
});

export const outputZ = z.object({
  data: z.string(),
});

export const useroutputZ = z.object({
  status: z.string(),
  user_data: z.object({
    id: z.string(),
    email: z.string(),
    password: z.string(),
    creation: z.string(),
    status: z.string(),
    s3_key: z.string(),
  }),
});

export const emailinputZ = z.object({
  email: z.string(),
});

export const logininputZ = z.object({
  email: z.string(),
  password: z.string(),
});

export const loginoutputZ = z.object({
  access_token: z.string(),
  token_type: z.string(),
});

export const addemailoutputZ = z.object({
  status: z.string(),
  user_id: z.string(),
});

export const registeremailinputZ = z.object({
  email: z.string(),
  password: z.string(),
  confirmpassword: z.string(),
});

type Input = z.infer<typeof inputZ>;
type Output = z.infer<typeof outputZ>;
type EmailInput = z.infer<typeof emailinputZ>;
type LoginInput = z.infer<typeof logininputZ>;
type LoginOutput = z.infer<typeof loginoutputZ>;
type UserOutput = z.infer<typeof useroutputZ>;
type AddUserOutput = z.infer<typeof addemailoutputZ>;

export const getDataHandler = async (input: Input): Promise<Output> => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/${input.id}`);

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await res.json();

  return {
    data: JSON.stringify(data),
  };
}


export const getUserDataHandler = async (input: EmailInput): Promise<UserOutput> => {
  const res = await fetch(`${process.env.BACKEND_API}/user/get/${encodeURIComponent(input.email)}`);

  if (!res.ok) {
    throw new Error('Network response was not ok');
  }

  const data = await res.json();

  return data
}


export const addUserDataHandler = async (input: LoginInput): Promise<AddUserOutput> => {
  const res = await fetch(`${process.env.BACKEND_API}/user/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': `${process.env.API_KEY}`,
    },
    body: JSON.stringify({email: input.email, password: input.password}),
  })
  console.log(res);
  if (!res.ok) {
    throw new Error('Network response with back-end was not ok');
  }

  const data = await res.json();

  return data


}

export default getDataHandler;
// export default {getDataHandler, getUserDataHandler };