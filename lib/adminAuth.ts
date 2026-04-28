import bcrypt from 'bcryptjs'

export const checkAdmin = (username: string, password: string) => {
  const adminUser = process.env.ADMIN_USERNAME
  const adminPass = process.env.ADMIN_PASSWORD
  const adminPassHash = process.env.ADMIN_PASSWORD_HASH

  if (!adminUser || (!adminPass && !adminPassHash)) {
    return false
  }

  if (username !== adminUser) {
    return false
  }

  if (adminPassHash) {
    return bcrypt.compareSync(password, adminPassHash)
  }

  return password === adminPass
}
