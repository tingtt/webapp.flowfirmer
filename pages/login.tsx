import Link from 'next/link'

const loginPage = () => (
  <div>
    <h1>Login 👋</h1>
    <p>
      <Link href="/">
        <a>Index</a>
      </Link>
    </p>
    <p>
      <Link href="/app">
        <a>Open web app.</a>
      </Link>
    </p>
  </div>
)

export default loginPage
