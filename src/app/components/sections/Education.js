const Education = (ctx, width, height, viewportWidth) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${viewportWidth < 768 ? '40' : '60'}px "Helvetica Neue"`;
  ctx.fillText('Education', width / 2, height / 4);
  ctx.font = `${viewportWidth < 768 ? '16' : '20'}px "Helvetica Neue"`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  const items = ['B.S. Petroleum Engineering - Federal University of Technology, Owerri'];
  items.forEach((item, index) => {
    ctx.fillText(item, width / 2, height / 2 + index * (viewportWidth < 768 ? 30 : 40));
  });
};

export default Education;