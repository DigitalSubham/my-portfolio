import { Github, Linkedin, Mail } from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-600 to-pink-600 mx-auto mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {`Have a project in mind? Let's work together!`}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Contact Information</h3>
            <p className="text-gray-600 dark:text-gray-400">
              {` Feel free to reach out to me through any of these channels. I'm
              always open to discussing new projects, creative ideas, or
              opportunities to be part of your vision.`}
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    shubhamkr354@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Linkedin className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">LinkedIn</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    linkedin.com/in/digital-subham-kumar
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Github className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-1 mr-3" />
                <div>
                  <h4 className="font-medium">GitHub</h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    github.com/DigitalSubham
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg p-6">
            <form
              action="https://getform.io/f/a6c78b4d-9b14-4de4-b94f-705a82847702"
              method="POST"
              className="space-y-4"
            >
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-800"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-800"
                  placeholder="Your Email"
                />
              </div>
              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium mb-1"
                >
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-800"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium mb-1"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-600 dark:focus:ring-purple-400 focus:border-transparent dark:bg-gray-800"
                  placeholder="Your Message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
