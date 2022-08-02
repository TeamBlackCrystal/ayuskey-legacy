import asyncio

from mipac.util import AuthClient

instance_url = input('Instance URL:')
application_name = input('Application Name (default: test app): ') or 'test app'
application_description = input('Application Description (default: this is test app): ') or 'this is test app'

async def main():
    auth_client = AuthClient(instance_url, application_name, application_description)
    auth_url = await auth_client.get_auth_url()
    print(auth_url)
    token = await auth_client.wait_oldauth()
    print(f'token: {token}')


if __name__ == '__main__':
    asyncio.run(main())
