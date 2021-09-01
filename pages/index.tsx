import Link from 'next/link'

const IndexPage = () => (
  <div>
    <h1>Hello Flow firmer. 👋</h1>
    <p>
      <Link href="/app">
        <a>Login</a>
      </Link>
    </p>
  </div>
)

export default IndexPage
