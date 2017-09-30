
export const ver = (req, res) => {
  console.log('opa', process.env.VERSION_NUMBER);
  res.status(200).json({ ver: '1.0.1'});
};
