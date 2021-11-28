import axios from "axios"
import { GetServerSideProps } from "next"
import Layout from "../../components/app/Layout"
import AppDataManager from "../../lib/app/appDataManager"

const appIndex = () => {
  try {
    AppDataManager.generateInstance()
  } catch (e) {
    AppDataManager.getInstance()
  }
  return <Layout />
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  var token = ""
  if (
    context.query.token == undefined ||
    typeof context.query.token != "string"
  ) {
    if (context.req.cookies.token == undefined) {
      context.res.statusCode = 302
      context.res.setHeader("location", "/login")
      context.res.end()
      return { props: {} }
    } else {
      token = context.req.cookies.token
    }
  } else {
    token = context.query.token
  }

  context.res.setHeader("set-cookie", [`token=${token}; HttpOnly; Path=/;`])
  console.log(context.res.getHeaders())

  await axios
    .post("https://flowfirmer.tingtt.jp" + "/api/tokenCheck", {
      bodyFlag: true,
      token: token,
    })
    .then((res) => {
      if (res.data.status != "200") {
        context.res.statusCode = 302
        context.res.setHeader("location", "/login")
        context.res.end()
      }
      context.res.setHeader("Cookie", [res.data.token])
    })
  return { props: {} }
}

export default appIndex
