const Skills = (ctx, width, height, viewportWidth) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${viewportWidth < 768 ? '40' : '60'}px "Helvetica Neue"`;
  ctx.fillText('Skills', width / 2, height / 4);
  ctx.font = `${viewportWidth < 768 ? '16' : '20'}px "Helvetica Neue"`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  const items = ['React', 'JavaScript', 'CSS', 'Node.js'];
  if (viewportWidth < 768) {
    items.forEach((item, index) => {
      ctx.fillText(item, width / 2, height / 2 + index * 30);
    });
  } else {
    items.forEach((item, index) => {
      ctx.fillText(item, width / 2 - 50 + (index % 2) * 100, height / 2 + Math.floor(index / 2) * 40);
    });
  }
};

export default Skills;