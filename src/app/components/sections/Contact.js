const Contact = (ctx, width, height, viewportWidth) => {
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `bold ${viewportWidth < 768 ? '40' : '60'}px "Helvetica Neue"`;
  ctx.fillText('Contact', width / 2, height / 4);
  ctx.font = `${viewportWidth < 768 ? '16' : '20'}px "Helvetica Neue"`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  const items = ['annon@email.com', 'linkedin.com/in/annon'];
  items.forEach((item, index) => {
    ctx.fillText(item, width / 2, height / 2 + index * (viewportWidth < 768 ? 30 : 40));
  });

  ctx.beginPath();
  ctx.arc(width / 2, height - (viewportWidth < 768 ? 50 : 100), viewportWidth < 768 ? 15 : 20, 0, Math.PI * 2);
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 1;
  ctx.stroke();
};

export default Contact;