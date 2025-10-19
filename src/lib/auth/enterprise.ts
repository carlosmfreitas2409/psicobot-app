import type { User, AuthContext, BetterAuthPlugin } from "better-auth";
import {
  APIError,
  sessionMiddleware,
  createAuthEndpoint,
} from "better-auth/api";

import { generateRandomString } from "better-auth/crypto";

import { z } from "zod";

export const enterprise = () => {
  return {
    id: "enterprise",
    schema: {
      user: {
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model: "organization",
              field: "id",
              onDelete: "cascade",
            },
          },
        },
      },
      organization: {
        modelName: "organization",
        fields: {
          name: {
            type: "string",
            required: true,
            fieldName: "name",
          },
          slug: {
            type: "string",
            required: true,
            unique: true,
            fieldName: "slug",
          },
          logo: {
            type: "string",
            required: false,
            fieldName: "logo",
          },
          createdAt: {
            type: "date",
            required: true,
            fieldName: "createdAt",
          },
        },
      },
      invitation: {
        modelName: "invitation",
        fields: {
          organizationId: {
            type: "string",
            required: true,
            references: {
              model: "organization",
              field: "id",
            },
            fieldName: "organizationId",
          },
          email: {
            type: "string",
            required: true,
            fieldName: "email",
          },
          role: {
            type: "string",
            required: false,
            fieldName: "role",
          },
          status: {
            type: "string",
            required: true,
            defaultValue: "pending",
            fieldName: "status",
          },
          expiresAt: {
            type: "date",
            required: true,
            fieldName: "expiresAt",
          },
          createdAt: {
            type: "date",
            required: true,
            fieldName: "createdAt",
            defaultValue: () => new Date(),
          },
          inviterId: {
            type: "string",
            references: {
              model: "user",
              field: "id",
            },
            fieldName: "inviterId",
            required: true,
          },
        },
      },
    },
    endpoints: {
      createOrganization: createAuthEndpoint(
        "/enterprise/organizations/create",
        {
          method: "POST",
          // use: [sessionMiddleware],
          body: z.object({
            organization: z.object({
              name: z.string().min(1),
              slug: z.string().min(1),
            }),
            admin: z.object({
              name: z.string().min(1),
              email: z.string().email(),
            }),
          }),
        },
        async (ctx) => {
          const { organization, admin } = ctx.body;

          const token = generateRandomString(32);

          await ctx.context.internalAdapter.createVerificationValue(
            {
              identifier: token,
              value: JSON.stringify({ admin, organization }),
              expiresAt: new Date(Date.now() + 60 * 5 * 1000),
            },
            ctx,
          );

          const url = new URL(`/sign-up`, ctx.context.baseURL);

          url.searchParams.set("token", token);

          console.log(url.toString());
          console.log(token);
          // send email with url

          return ctx.json({
            status: true,
          });
        },
      ),
      signUpEnterprise: createAuthEndpoint(
        "/enterprise/sign-up",
        {
          method: "POST",
          body: z.object({
            password: z.string().min(1),
            token: z.string(),
          }),
        },
        async (ctx) => {
          const { password, token } = ctx.body;

          const verification =
            await ctx.context.internalAdapter.findVerificationValue(token);

          if (!verification) {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid token",
            });
          }

          if (verification.expiresAt < new Date()) {
            await ctx.context.internalAdapter.deleteVerificationValue(
              verification.id,
            );

            throw new APIError("BAD_REQUEST", {
              message: "Expired token",
            });
          }

          await ctx.context.internalAdapter.deleteVerificationValue(
            verification.id,
          );

          const { admin, organization } = JSON.parse(verification.value) as {
            admin: {
              name: string;
              email: string;
            };
            organization: {
              name: string;
              slug: string;
            };
          };

          const isValidEmail = z.string().email().safeParse(admin.email);

          if (!isValidEmail.success) {
            throw new APIError("BAD_REQUEST", {
              message: "Invalid e-mail",
            });
          }

          const minPasswordLength =
            ctx.context.password.config.minPasswordLength;
          if (password.length < minPasswordLength) {
            ctx.context.logger.error("Password is too short");
            throw new APIError("BAD_REQUEST", {
              message: "Password too short",
            });
          }

          const maxPasswordLength =
            ctx.context.password.config.maxPasswordLength;
          if (password.length > maxPasswordLength) {
            ctx.context.logger.error("Password is too long");
            throw new APIError("BAD_REQUEST", {
              message: "Password too long",
            });
          }

          const dbUser = await ctx.context.internalAdapter.findUserByEmail(
            admin.email,
          );

          if (dbUser?.user) {
            ctx.context.logger.info(
              `Sign-up attempt for existing email: ${admin.email}`,
            );

            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: "User already exists use another e-mail",
            });
          }

          const dbOrg = await ctx.context.adapter.findOne({
            model: "organization",
            where: [
              {
                field: "slug",
                value: organization.slug,
              },
            ],
          });

          if (dbOrg) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: "Organization already exists",
            });
          }

          const createdOrg = await ctx.context.adapter.create({
            model: "organization",
            data: {
              name: organization.name,
              slug: organization.slug,
              createdAt: new Date(),
            },
          });

          const hash = await ctx.context.password.hash(password);

          let createdUser: User;

          try {
            createdUser = await ctx.context.internalAdapter.createUser(
              {
                email: admin.email.toLowerCase(),
                name: admin.name,
                image: null,
                emailVerified: true,
                organizationId: createdOrg.id,
              },
              ctx,
            );

            if (!createdUser) {
              throw new APIError("BAD_REQUEST", {
                message: "Failed to create user",
              });
            }
          } catch (e) {
            if (e instanceof APIError) {
              throw e;
            }

            ctx.context.logger?.error("Failed to create user", e);

            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: "Failed to create user",
              details: e,
            });
          }

          if (!createdUser) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: "Failed to create user",
            });
          }

          await ctx.context.internalAdapter.linkAccount(
            {
              userId: createdUser.id,
              providerId: "credential",
              accountId: createdUser.id,
              password: hash,
            },
            ctx,
          );

          return ctx.json({
            token: null,
            user: {
              id: createdUser.id,
              email: createdUser.email,
              name: createdUser.name,
              image: createdUser.image,
              emailVerified: createdUser.emailVerified,
              organizationId: createdOrg.id,
              createdAt: createdUser.createdAt,
              updatedAt: createdUser.updatedAt,
            },
          });
        },
      ),
      createInvitation: createAuthEndpoint(
        "/enterprise/invitations/create",
        {
          method: "POST",
          body: z.object({
            email: z.string().email(),
            role: z.string().optional(),
          }),
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const { user } = ctx.context.session;

          const { email, role } = ctx.body;

          const organizationId = user.organizationId;

          const adapter = (ctx.context as AuthContext).adapter;

          const userExists = await adapter.findOne<
            User & { organizationId: string }
          >({
            model: "user",
            where: [
              {
                field: "email",
                value: email,
              },
            ],
          });

          if (userExists && userExists.organizationId !== organizationId) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: "User already belongs to another organization",
            });
          }

          if (userExists) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: "User already belongs to this organization",
            });
          }

          const alreadyInvited = await ctx.context.adapter.findOne({
            model: "invitation",
            where: [
              {
                field: "email",
                value: email,
              },
            ],
          });

          if (alreadyInvited) {
            throw new APIError("UNPROCESSABLE_ENTITY", {
              message: "User already has a pending invitation",
            });
          }

          const defaultExpiration = 60 * 60 * 48;

          const expiresAt = new Date(Date.now() + defaultExpiration * 1000);

          const invitation = await ctx.context.adapter.create({
            model: "invitation",
            data: {
              email,
              role,
              organizationId,
              expiresAt,
              status: "pending",
              inviterId: user.id,
            },
          });

          // send email with invitation

          return ctx.json({
            invitation,
          });
        },
      ),
      listMembers: createAuthEndpoint(
        "/enterprise/members",
        {
          method: "GET",
          use: [sessionMiddleware],
        },
        async (ctx) => {
          const { user } = ctx.context.session;

          const users = await ctx.context.internalAdapter.listUsers(
            undefined,
            undefined,
            undefined,
            [{ field: "organizationId", value: user.organizationId }],
          );

          const members = users.map((user) => ({
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            createdAt: user.createdAt,
          }));

          return ctx.json({
            members,
          });
        },
      ),
    },
  } satisfies BetterAuthPlugin;
};
