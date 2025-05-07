const Hero: React.FC = () => {
  return (
    <section className="flex items-center justify-center">
      <div className="container px-4">
        <div className="grid items-center gap-6 md:grid-cols-2">
          <div className="flex justify-center md:order-2">
            <img 
              className="max-md:w-full" 
              src="/frame.png" 
              width="326" 
              height="290" 
              alt="frame" 
            />
          </div>
          <div className="text-center md:text-left max-w-[600px]">
            <h1 className="mb-1.5 text-[56px] font-bold leading-none text-[#F5BF42] lg:text-[73px]">
              Tasker
            </h1>
            <p className="text-lg my-2 opacity-60 max-w-[600px]">
              Effortlessly Organize, Prioritize, and Conquer Tasks with Tasker - Your Personal Productivity Ally for
              Seamless Goal Achievement and Stress-Free Task Management.
            </p>
          </div>
        </div>
      </div>  
    </section>
  );
};

export default Hero;