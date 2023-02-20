<template>
  <nav text-xl  inline-flex gap-2>
    <button icon-btn @click="toggleDark()">
      <div dark:i-carbon-moon i-carbon-sun />
    </button>

    <a icon-btn i-carbon-logo-github rel="noreferrer" href="https://github.com/Magic-Academy" target="_blank"
      title="GitHub" />
  </nav>
</template>

<style scoped></style>
