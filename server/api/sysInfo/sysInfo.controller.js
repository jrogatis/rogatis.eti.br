
export const ver = (req, res) => {
  console.log('opa', process.env);
  res.status(200).json({ ver: process.env.VER });
};
